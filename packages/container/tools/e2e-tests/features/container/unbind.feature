Feature: Bind

  A service can be unbound from a container.

  Background: Having a container
    Given a container

    Rule: container acknowledges an unbinding operation
      Scenario: A service unbinding is acknowledged after being bound to a container
        Given a service "service-id" binding to constant value
        When binding is bound to container
        And service "service-id" is unbound from container
        Then container acknowledges service "service-id" bindings to be unbound

      Scenario: A binding identifier unbinding is acknowledged after being bound to a container
        Given a service "service-id" binding to constant value
        When binding is bound to container
        And binding is unbound by its id from container
        Then container acknowledges service "service-id" bindings to be unbound
