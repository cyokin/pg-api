SELECT
  CASE WHEN table_type = 'BASE TABLE' THEN ccu.column_name = tc.column_name
  WHEN table_type = 'VIEW' THEN tc.ordinal_position = 1
  ELSE FALSE
  END AS is_primary_key,
  tc.*,
  tb.table_type
FROM information_schema.columns tc
  RIGHT JOIN  (
                SELECT table_schema,table_name , table_type
                FROM information_schema.tables
                WHERE (table_type = 'BASE TABLE' OR table_type = 'VIEW')
                      AND table_schema NOT IN ('pg_catalog', 'information_schema')
              ) tb
    on tc.table_schema = tb.table_schema AND tb.table_name = tc.table_name
  LEFT JOIN information_schema.constraint_column_usage ccu
    ON tc.table_schema =ccu.table_schema AND tc.table_name = ccu.table_name;