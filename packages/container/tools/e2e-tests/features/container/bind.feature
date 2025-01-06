Feature: Bind

  A service can be bound to a container.

  Background: Having a container
    Given a container

    Rule: container acknowledges a binding

      Scenario: A binding is acknowledged after being bound to a container
        Given a service "service-id" binding to constant value
        When binding is bound to container
        Then container acknowledges binding to be bound
