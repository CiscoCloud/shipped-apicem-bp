# Shipped APIC-EM and NextUI buildpack
Shipped is a hybrid devops framework that enables developer to easily build, deploy and run containerized microservices.

This repository include sample code and Shipped buildpack bootstrap data to enable developer to build and deploy application using Cisco APIC-EM APIs and NextUI visualization library.

## Buildpack
Buildpack github repository in Shipped is a pre-packged framework. This buildpack include following
- Sample application implementing some APIC-EM APIs.
- Sample web frontend implementing NextUI topology feature.
- Basic build, test and runtime scripts to build, test and run application.
- This repository in combination with APIC-EM buildpack defined in Shipped provide complete build and runtime environment details.

### APIC-EM

The Application Policy Infrastructure Controller (APIC) Enterprise Module (API) is a Software Defined Network (SDN) controller from Cisco. APIC-EM buildpack enable developer to build application using northbound APIs.

![APIC-EM Application](./docs/apic-em-api.jpg "APIC-EM Application")

More details on APIC-EM development  https://developer.cisco.com/site/apic-em/

### NextUI

NeXt UI toolkit is an HTML5/JavaScript based toolkit for network web application. Provide high performance and high quality framework and network centric topology component.
Sample topology that this sample implements.
![NextUI topology](./docs/nextui-topology.png "NeXtUI topology")

More details on NextUI toolkit : https://developer.cisco.com/site/NeXt-test/

### Sample Application Code details
