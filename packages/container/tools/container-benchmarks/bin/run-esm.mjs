#!/usr/bin/env node
'use strict';

import { run } from '../lib/esm/index.js';

console.log('[ESM] Running benchmarks...\n');

await run();
