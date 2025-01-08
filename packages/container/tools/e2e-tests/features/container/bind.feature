Feature: Bind

  A service can be bound to a container.

  Background: Having a container
    Given a container

    Rule: container acknowledges a binding

      Scenario: A binding is acknowledged after being bound to a container
        Given a service "service-id" binding to constant value
        When binding is bound to container
        Then container acknowledges binding to be bound

      Scenario: A named binding is acknowledged after being bound to a container
        Given a service "weapon" sword type binding as "sword" when named "sword"
        When "sword" binding is bound to container
        Then container acknowledges "sword" binding to be bound when named "sword"

      Scenario: A tagged binding is acknowledged after being bound to a container
        Given a service "weapon" sword type binding as "sword" when tagged "kind" to "sword"
        When "sword" binding is bound to container
        Then container acknowledges "sword" binding to be bound when tagged "kind" to "sword"

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
