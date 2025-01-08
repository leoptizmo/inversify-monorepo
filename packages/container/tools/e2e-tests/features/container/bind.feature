Feature: Bind

  A service can be bound to a container.

  Background: Having a container
    Given a container

    Rule: container acknowledges a binding

      Scenario: A binding is acknowledged after being bound to a container
        Given a service "service-id" binding to constant value
        When binding is bound to container
        Then container acknowledges binding to be bound

    Rule: container binds in the expected scope

      Scenario: A binding is bound to a container and two requests are resolved according to the binding scope
        Given a service "service-id" binding to dynamic value in <binding_scope> scope
        When binding is bound to container
        And container gets a "first" value for service "service-id"
        And container gets a "second" value for service "service-id"
        Then "first" and "second" values are <equality>

        Examples:
          | binding_scope | equality |
          | "Request"     | distinct |
          | "Singleton"   | equal    |
          | "Transient"   | distinct |

      Scenario: A binding is bound to a container and two sub requests are resolved according to the binding scope
        Given a sword type binding as "sword" in <binding_scope> scope
        And a service "service-id" dual wield swordsman type binding
        When "sword" binding is bound to container
        And binding is bound to container
        And container gets a value for service "service-id"
        Then dual wield swordsman swords are <equality>

        Examples:
          | binding_scope | equality |
          | "Request"     | equal    |
          | "Singleton"   | equal    |
          | "Transient"   | distinct |

    Rule: container binds with expected constraint
      Scenario: A named binding is bound to a container and it is only used when its constraint is fulfilled
        Given a service "weapon" sword type binding as "sword" when named "sword"
        And a service "weapon" bow type binding as "bow" when named "bow"
        And a service "warrior" archer type binding as "archer"
        When "sword" binding is bound to container
        And "bow" binding is bound to container
        And "archer" binding is bound to container
        And container gets a value for service "warrior"
        Then value is an archer with a bow

      Scenario: A tagged binding is bound to a container and it is only used when its constraint is fulfilled
        Given a service "weapon" sword type binding as "sword" when tagged "kind" to "sword"
        And a service "weapon" bow type binding as "bow" when tagged "kind" to "bow"
        And a service "warrior" archer type binding as "archer"
        When "sword" binding is bound to container
        And "bow" binding is bound to container
        And "archer" binding is bound to container
        And container gets a value for service "warrior"
        Then value is an archer with a bow
