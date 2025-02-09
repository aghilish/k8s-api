# Kubernetes APIs

Kubernetes provides a robust API for managing your cluster. API uses a RESTful design, allowing to perform common actions like creating, retrieving, 
updating, deleting, listing, patching, and watching various resources within your cluster,

Kubernetes APIs are divided into groups:

1. **core** group: this includes _Nodes_, _Pods_, _Namespaces_, _Services_, _ConfigMaps_ and _Secrets_. 
2. **named** groups: These groups categorize related functionalities. For example, the ```apps``` group contains resources for managing _deployments_, 
_stateful sets_, _daemon sets_, and _replica sets_, while the ```batch``` group handles _jobs_ and _cron jobs_.

Each group may have one or more versions that evolve independent of other API groups, and each version within the group has one or more resources. 

<p align="center">
  <img alt="Kubernetes REST Paths" src="assets/kubernetes_rest_paths.png" width="600"/>
</p>
 
To summarize:

1. **Group**: Categorizes resources based on functionality or origin. This allows for easy API extension by adding new groups for specific features.

2. **Version**: Represent specific API versions within a group. New features or modifications to existing resources might be introduced in different versions. Versioning ensures compatibility and smoother upgrades.

3. **Resource** type is the name used in the URL (e.g., pods, namespaces, services).

4. **Kind**: defines the concrete representation (object schema) of a resource type.

5. **Collection**: refers to a list of instances for a specific resource type. There are distinct collection kinds with "List" appended (e.g., _PodList_, _ServiceList_).

6. **Resource**: an individual instance of a resource type, typically representing an object in your cluster.

7. **Sub-resources:**: for specific resource types, additional functionalities are exposed as sub-resources within the resource URI path.

To see all the available API resources in your cluster: ```kubectl api-resources```

```
$ kubectl api-resources
NAME                                SHORTNAMES   APIVERSION                                NAMESPACED   KIND
bindings                                         v1                                        true         Binding
configmaps                          cm           v1                                        true         ConfigMap
endpoints                           ep           v1                                        true         Endpoints
events                              ev           v1                                        true         Event
limitranges                         limits       v1                                        true         LimitRange
namespaces                          ns           v1                                        false        Namespace
nodes                               no           v1                                        false        Node
persistentvolumeclaims              pvc          v1                                        true         PersistentVolumeClaim
persistentvolumes                   pv           v1                                        false        PersistentVolume
pods                                po           v1                                        true         Pod
...
```

The API server handles all requests. 

<p align="center">
  <img alt="REST post" src="assets/request_resource.png" width="600"/>
</p>


When we create a deployment for instance, the kube-apiserver validates the content of our deployment to ensure it meets the required format and follows the rules. Once validated, it stores the deployment information in the cluster's data store, typically etcd.

<p align="center">
  <img alt="Deployment controller" src="assets/deployment_controller.png" width="600"/>
</p>

Much of the behavior of Kubernetes is implemented by programs called controllers, that are clients of the API server. 
Kubernetes comes already with a set of built-in controllers. For instance we can look at the `kube-controller-manager` pod's log to see which controllers are started. The _deployment controller_ is one of those.

```
kubectl logs -n kube-system                         kube-controller-manager-sveltos-management-control-plane 
...
I0531 15:34:16.026590       1 controllermanager.go:759] "Started controller" controller="deployment-controller"
```

The deployment controller is constantly watching for deployment instances. In our case, when we created a new deployment, the deployment controller became aware of this change and it took action to achieve the desired state we specified. In this case, it created a ReplicaSet resource. The deployment controller also updated the deployment status section. This section keeps track of the progress towards achieving the desired state. 

# Objects

Every object must have the following data. 

`TypeMeta` contains the kind and API version.

A nested field `metadata` contains:

1. **namespace**: the default namespace is 'default'. Cluster wide resources do not have this field set.
2. **name**: a string that uniquely identifies this object within the current namespace. This value is used in the path when retrieving an individual object.
3. **uid**: a unique in time and space value used to distinguish between objects with the same name that have been deleted and recreated.
4. **resourceVersion**: a string that identifies the internal version of this object that can be used by clients to determine when objects have changed;
5. **creationTimestamp**: a string representing the date and time an object was created.
6. **deletionTimestamp**: a string representing the date and time after which this resource will be deleted.
7. **labels**: a map of string keys and values that can be used to organize and categorize objects.
8. **annotations**: a map of string keys and values that can be used by external tooling to store and retrieve arbitrary metadata about this object.

<p align="center">
  <img alt="Kubernetes Object" src="assets/kubernetes_object.png" width="600"/>
</p>

A nested object field called `spec` represents the desired state of an object. 

A nested object field called `status` summarizes the current state of the object in the system. The Kubernetes declarative API enforces a separation of responsibilities. You declare the desired state of your resource (spec). The Kubernetes controller keeps the current state of Kubernetes objects in sync with your declared desired state.

When covering [reconcilers](../docs/reconciler.md) we will cover:

- how Kubernetes uses resourceVersion to detect conflicts when updating a resource;

- why deletionTimestamp, along with finalizers, is important;

- how to use labels to query a group of related objects (for instance all Pods backing up a Service);

- how to provide different authorizations for Spec and Status and how reconcilers work.

# Extending the Kubernetes API

Any system that is successful needs to grow and change as new use cases emerge or existing ones change. Therefore, Kubernetes has designed the Kubernetes API to continuously change and grow. There are two ways to extend Kubernetes APIs:

- The `CustomResourceDefinition` (CRD) mechanism allows you to declaratively define a new custom API with an API group, kind, and schema that you specify. CRDs allow you to create new types of resources for your cluster without writing and running a custom API server. 
When you create a new CustomResourceDefinition, the Kubernetes API Server creates a new RESTful resource path for each version specified. 

- The `aggregation layer` sits behind the primary API server, which acts as a proxy. This arrangement is called API Aggregation (AA), which allows you to provide specialized implementations for your custom resources by writing and deploying your own API server. 
The main API server delegates requests to your API server for the custom APIs that you specify.


<p align="center">
  <img alt="Kube-aggregator" src="assets/extension_apiserver.png" width="600"/>
</p>

You can register an `extension API server` by creating an _APIService_ claiming a URL path in the Kubernetes API. From that point on, `kube-aggregator` will forward  any request sent to that API path will be forwarded to the registered APIService.

Most of the time you are fine with adding a new CustomResourceDefinition. Unless you need custom validations and already have a program that serves your API and works well, you can go with CRD. This tutorial will delve into the process of creating CustomResourceDefinitions.

# CustomResourceDefinition

To introduce new resources, you can use CustomResourceDefinitions.
CRDs extends Kubernetes capabilities by allowing users to create new types of resources beyond the built-in set.

A CustomResourceDefinition is a Kubernetes resource itself. So you can create a CustomResourceDefinition like you would create any other Kubernetes resources.

Most validation can be specified in the CRD using OpenAPI v3.0 validation and the Common Expression Language. Any other validations is supported by addition of a Validating Webhook.

In this section, we’ll dive deep into the creation and management of Custom Resource Definitions in Kubernetes. 
