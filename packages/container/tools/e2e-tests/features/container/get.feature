Feature: Get

  A container can provide a resolved value for a given service identifier.

  Background: Having a container
    Given a container

    Rule: container provides a value given a service identifier
      Scenario: No binding is bound to a container and service is resolved in autobind mode
        When container gets a dual wield swordsman type value with autobind mode
        Then value is a dual wield swordsman with two swords

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

      Scenario: A resolved value binding is bound to a container and value is properly resolved
        Given a service "army" resolved value binding as "army" depending on "warrior"
        And a service "weapon" bow type binding as "bow"
        And a service "warrior" archer type binding as "archer"
        When "army" binding is bound to container
        And "bow" binding is bound to container
        And "archer" binding is bound to container
        And container gets a value for service "army"
        Then value is an array with an archer with a bow

    Rule: container provides an activated value given a service identifier

      Scenario: A binding with activation is bound to a container and value is properly resolved
        Given a sword type binding as "sword" with a weapon upgrade activation
        When "sword" binding is bound to container
        And container gets a sword type value
        Then value is a sword with improved damage
