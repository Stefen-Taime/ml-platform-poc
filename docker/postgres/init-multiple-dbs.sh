#!/bin/bash
# Script pour créer plusieurs bases de données PostgreSQL

set -e
set -u

function create_user_and_database() {
    local database=$1
    echo "  Creating user and database '$database'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE $database;
        GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
}

# Log the environment variables (for debugging)
echo "POSTGRES_USER: $POSTGRES_USER"
echo "POSTGRES_MULTIPLE_DATABASES: $POSTGRES_MULTIPLE_DATABASES"

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
    echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
    for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
        # Check if database already exists
        if psql -U "$POSTGRES_USER" -lqt | cut -d '|' -f 1 | grep -qw "$db"; then
            echo "Database $db already exists, skipping creation"
        else
            create_user_and_database "$db"
            echo "Database $db created"
        fi
    done
    echo "Multiple databases creation completed"
fi

# Verify databases were created
for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
    if psql -U "$POSTGRES_USER" -lqt | cut -d '|' -f 1 | grep -qw "$db"; then
        echo "Database $db verified successfully"
    else
        echo "ERROR: Database $db was not created properly"
        exit 1
    fi
done

echo "PostgreSQL initialization completed successfully"