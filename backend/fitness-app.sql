\echo 'Delete and recreate fitness_app db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE fitness_app;
CREATE DATABASE fitness_app;
\connect fitness_app

\i fitness-app-schema.sql
-- \i student-store-seed.sql

\echo 'Delete and recreate fitness_app_test db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE student_store_test;
CREATE DATABASE student_store_test;
\connect student_store_test

\i fitness-app-schema.sql
-- \i student-store-seed.sql
