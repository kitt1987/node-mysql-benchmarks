/**
 * Copyright (C) 2012, Oleg Efimov and other contributors
 *
 * See license text in LICENSE file
 */

/*
> mysql -u root
CREATE DATABASE test DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
GRANT ALL PRIVILEGES ON test.* TO 'test'@'127.0.0.1' IDENTIFIED BY '';
*/

"use strict";

function addBenchmark(cfg, module, async, typeCast, name) {
  if (!name) {
    name = module;
  }
  cfg.benchmarksO[name] = {
    name:     name,
    module:   module,
    async:    async,
    typeCast: typeCast
  };
  cfg.benchmarksA.push(cfg.benchmarksO[name]);
}

exports.getConfig = function (factor) {
  var cfg = {
    // Database connection settings
    host: "192.168.99.100",
    port: 32768,
    user: "root",
    password: "0000",
    database: "test",
    test_table: "test_table",

    // Benchmarks parameters
    escapes_count: 1000000 * factor,
    string_to_escape: "str\\str\"str\'str\x00str",
    reconnect_count: 1000 * factor,
    insert_rows_count: 10000 * factor,

    // Delay before assertion check (ms)
    delay_before_select: 10000 * factor,
    cooldown: 10000 * factor
  };

  cfg.create_table_query = "CREATE TABLE " + cfg.test_table +
                           " (alpha INTEGER, beta VARCHAR(128), pi FLOAT) " +
                           "ENGINE=MEMORY";

  cfg.insert_query = "INSERT INTO " + cfg.test_table +
                     " VALUES (1, 'hello', 3.141)";

  cfg.select_query = "SELECT * FROM " + cfg.test_table;

  cfg.benchmarksA = [];
  cfg.benchmarksO = {};

  //                module                  async  typeCast
  addBenchmark(cfg, "mariasql",             true,  false, "mariasql(" + require('../package.json').dependencies.mariasql + ")");
  addBenchmark(cfg, "mysql2",               true,  true,  "mysql2(" + require('../package.json').dependencies.mysql2 + ')');
  addBenchmark(cfg, "mysql2",               true,  false, "mysql2(" + require('../package.json').dependencies.mysql2 + ") *");
  addBenchmark(cfg, "mysql",                true,  true,  "mysql(" + require('../package.json').dependencies.mysql + ")");
  addBenchmark(cfg, "mysql",                true,  false, "mysql(" + require('../package.json').dependencies.mysql + ") *");

  return cfg;
};
