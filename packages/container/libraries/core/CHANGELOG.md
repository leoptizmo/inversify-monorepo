# @inversifyjs/core

## 1.3.5

### Patch Changes

- 2cbb782: Updated ESM build to provide proper types regardless of the ts resolution module strategy in the userland.
- Updated dependencies
  - @inversifyjs/reflect-metadata-utils@0.2.4
  - @inversifyjs/common@1.4.0

## 1.3.4

### Patch Changes

- 535ad85: Updated ESM build to be compatible with both bundler and NodeJS module resolution algorithms
- Updated dependencies
  - @inversifyjs/reflect-metadata-utils@0.2.3
  - @inversifyjs/common@1.3.3

## 1.3.3

### Patch Changes

- 0e347ab: Updated get metadata flow to provide better error messages when missing metadata.

## 1.3.2

### Patch Changes

- 2b629d6: Removed wrong os constraint.
- Updated dependencies
  - @inversifyjs/reflect-metadata-utils@0.2.2
  - @inversifyjs/common@1.3.2

## 1.3.1

### Patch Changes

- 46b2569: Removed wrong dev engines constraint.
- Updated dependencies
  - @inversifyjs/reflect-metadata-utils@0.2.1
  - @inversifyjs/common@1.3.1

## 1.3.0

### Minor Changes

- 3b6344c: Added `LegacyTargetImpl`.
- 3b6344c: Added `getClassElementMetadataFromLegacyMetadata`.

## 1.2.0

### Minor Changes

- fca62ce: Added `LegacyTarget` model.
- fca62ce: Added `getTargets`.
- c588a5a: Added `getClassMetadataFromMetadataReader`.

### Patch Changes

- 6469c67: Updated `getClassMetadata` to correctly fetch name and target names

## 1.1.2

### Patch Changes

- Updated dependencies
  - @inversifyjs/common@1.3.0

## 1.1.1

### Patch Changes

- Updated dependencies
  - @inversifyjs/common@1.2.1

## 1.1.0

### Minor Changes

- e594986: Added `ClassMetadata`.
- e594986: Added `getClassMetadata`.

### Patch Changes

- Updated dependencies
  - @inversifyjs/reflect-metadata-utils@0.2.0
  - @inversifyjs/common@1.2.0
