## State Transitions

An _alert_ is ```Inactive``` when it is created. Here are tne most common states for an alert:

* ```Inactive``` - The alert is not processing. No notifications will be generated.
* ```Starting``` - The alert is attempting to transition to the ```Active``` state.
* ```Active``` - The alert is tracking; however, its conditions have not yet been met.
* ```Stopping``` - The alert is attempting to transition to the ```Inactive``` state.
* ```Triggered``` - The alert's conditions have been met. Functionally speaking, this is equivalent to the ```Inactive``` state.

Here is a visualization of possible state transitions:

![Alert State Diagram](../images/states.svg)