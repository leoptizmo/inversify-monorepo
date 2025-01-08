Feature: Get

  A container can provide a resolved value for a given service identifier.

  Background: Having a container
    Given a container

    Rule: container provides a value given a service
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
