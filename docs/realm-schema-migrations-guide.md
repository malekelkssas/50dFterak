Here is a clean **Markdown file** you can copy as `REALM_MIGRATIONS.md`:

---

# Realm Schema Migrations Guide

## 📌 Overview

Realm is a **schema-based local database**.
Whenever you modify your schema (add/remove/rename fields, change types, etc.), you must handle a **migration**.

If you don’t, the app may crash in production when users upgrade.

---

# 🧠 When Is Migration Required?

A migration is required when you:

* ✅ Add a new field
* ✅ Remove a field
* ✅ Rename a field
* ✅ Change a field type
* ✅ Add a new model
* ✅ Change primary keys
* ✅ Add or remove indexes

If the schema changes, you must:

1. Increase `schemaVersion`
2. Provide a `migration` function (if needed)

---

# 🔢 Basic Migration Setup

```ts
import Realm from "realm";

const realm = await Realm.open({
  schema: [User],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      // Migration logic here
    }
  },
});
```

---

# 🧩 Example 1: Adding a Field

## Version 1 Schema

```ts
class User extends Realm.Object {
  static schema = {
    name: "User",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      age: "int",
    },
  };
}
```

## Version 2: Add `isActive`

```ts
class User extends Realm.Object {
  static schema = {
    name: "User",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      age: "int",
      isActive: { type: "bool", default: true },
    },
  };
}
```

## Open Realm With Migration

```ts
const realm = await Realm.open({
  schema: [User],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const newObjects = newRealm.objects("User");
      for (let i = 0; i < newObjects.length; i++) {
        newObjects[i].isActive = true;
      }
    }
  },
});
```

---

# 🧩 Example 2: Removing a Field (Safe Way)

⚠️ Removing fields directly can cause crashes if not migrated properly.

## Version 1

```ts
age: "int"
```

## Version 2 (Remove `age`)

Remove it from schema:

```ts
properties: {
  _id: "objectId",
  name: "string",
}
```

Increase version:

```ts
schemaVersion: 2
```

Migration function can remain empty if no transformation is needed:

```ts
migration: (oldRealm, newRealm) => {
  if (oldRealm.schemaVersion < 2) {
    // No transformation needed
  }
}
```

Realm will automatically remove the column.

---

# 🧩 Example 3: Renaming a Field (Manual Copy Required)

Realm does NOT automatically rename fields.

## Version 1

```ts
fullName: "string"
```

## Version 2

```ts
name: "string"
```

## Migration

```ts
migration: (oldRealm, newRealm) => {
  if (oldRealm.schemaVersion < 2) {
    const oldObjects = oldRealm.objects("User");
    const newObjects = newRealm.objects("User");

    for (let i = 0; i < oldObjects.length; i++) {
      newObjects[i].name = oldObjects[i].fullName;
    }
  }
}
```

After confirming everything works, you can remove `fullName`.

---

# 🚀 Production Best Practices

### 1️⃣ Always Increment `schemaVersion`

Every schema change = new version.

---

### 2️⃣ Never Rename Directly

Instead:

1. Add new field
2. Copy data in migration
3. Release
4. Remove old field in a later version

---

### 3️⃣ Test Upgrade Flow

Simulate real upgrade:

1. Install Version 1
2. Add test data
3. Upgrade to Version 2
4. Verify data integrity

---

### 4️⃣ Avoid Destructive Development Habits

During development, you might:

* Reinstall app
* Clear storage
* Reset database

In production, the database file persists.
Migrations become mandatory.

---

# 🔥 Common Error

If you forget migration:

```
Migration is required due to the following errors:
```

Fix:

* Increase `schemaVersion`
* Add migration function

---

# 🏗 Recommended Pattern

```ts
const SCHEMA_VERSION = 3;

Realm.open({
  schema: [...],
  schemaVersion: SCHEMA_VERSION,
  migration: (oldRealm, newRealm) => {
    switch (oldRealm.schemaVersion) {
      case 0:
      case 1:
        // migrate to v2
      case 2:
        // migrate to v3
        break;
    }
  },
});
```

This allows chained migrations safely.

---

# ✅ Summary

* Realm requires migrations for schema changes
* Always increment `schemaVersion`
* Handle renames manually
* Test upgrade paths
* Dev resets hide migration problems