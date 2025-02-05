## Unit test instructions

**Important**: Apply this instructions **only** when you are told to write or update unit test files.

We use jest for writing unit and integration tests. A test file must include:

1. **Class Scope**: The outermost `describe` block for the class to be tested. Skip this scope when not testing a class.
2. **Method/Function Scope**: Nested `describe` blocks for different scenarios.
3. **Method/Function Input Scope**: Further nested `describe` blocks for different input scenarios for the method/function.
6. **Method/Function Code Flow Scope**: Further nested `describe` blocks for different behaviors scenarios with the given input for the method/function.
5. **Arrange in `beforeAll`**: Setting up the necessary conditions and inputs.
6. **Act in `beforeAll`**: Executing the function or method being tested.
7. **Assert in `it` clauses**: Verifying that the outcome is as expected. When asserting mock calls, assert how many times the mock has been called and which params was called with.

We writting unit tests, we expect external modules are mocked using `jest.fn`.
