Feature: Activation

  A container can register service activation that are invoked when the service is resolved.

  Background: Having a container
    Given a container

    Rule: an activation is invoked when its asociated service is resolved

      Scenario: A registered activation is invoked when the service is resolved
        Given a sword type binding as "sword"
        When "sword" binding is bound to container
        And a weapon upgrade activation is registered for sword type
        And container gets a sword type value
        Then value is a sword with improved damage

      Scenario: An activation registered twice is invoked when the service is resolved
        Given a sword type binding as "sword"
        When "sword" binding is bound to container
        And a weapon upgrade activation is registered for sword type
        And a weapon upgrade activation is registered for sword type
        And container gets a sword type value
        Then value is a sword with improved damage (x2)
