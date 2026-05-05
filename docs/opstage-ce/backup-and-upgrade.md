# Backup and Upgrade

Opstage CE state lives entirely in `${OPSTAGE_DATA_DIR}` (default `/app/data`). Backing up the data dir is the same as backing up Opstage.

## What's in the data directory

```text
/app/data/
├── opstage.db          # SQLite — the single source of truth
└── backups/            # optional, written by manual or scheduled backups
```

## Backup options

### 1. Owner-only download from the console

**Settings → Diagnostics → Download SQLite backup**.

This issues a consistent online snapshot of `opstage.db` (using SQLite's online backup API) and streams it to your browser. The action is audited (`backup.sqlite.created`).

### 2. File-level copy at rest

If you can pause writes (e.g. compose-stop the container during a maintenance window), a plain `cp opstage.db opstage-$(date +%F).db` is sufficient.

### 3. Scheduled snapshot (operator-driven)

Trigger the same backup endpoint on a schedule from outside the container, or mount `OPSTAGE_BACKUP_DIR` to a host directory and snapshot it.

::: tip
SQLite's online backup is safe even with concurrent writes. You do **not** need to stop the backend for the option-1 path.
:::

## Restore

1. Stop the Opstage container.
2. Replace `opstage.db` in the data dir with the backup file.
3. Start the container; Prisma will validate the schema and run any pending migrations.

::: warning
Always restore into the same or a newer Opstage CE version. Restoring an older DB into a much newer Opstage may require running migrations the older DB doesn't know about; restoring a newer DB into an older Opstage is unsupported.
:::

## Upgrades

1. **Read the changelog** for the target version.
2. **Back up `/app/data`.**
3. Pull the new image and recreate the container:

   ```bash
   docker compose pull
   docker compose up -d
   ```

4. The backend runs Prisma migrations on start.
5. Verify in **Settings → Diagnostics** that the version reflects the new tag.

## Rollback

1. Stop the container.
2. Restore the pre-upgrade `opstage.db` from your backup.
3. Pin the previous image tag in your compose file.
4. Start the container.

If the upgrade introduced an irreversible migration, a clean restore of the old DB into the old image is the safe path; do not run a newer DB against an older image.
