---
transition: slide-left
---

# Extending the Kubernetes API

<div v-click>
Kubernetes API is designed to evolve with new use cases.
</div>

<div v-click>
Two primary methods to extend it:
</div>

<div v-click>
 
 **CustomResourceDefinition (CRD)** - Declaratively define new custom APIs.

</div>

<div v-click>

**API Aggregation (AA)** - Deploy custom API servers for specialized implementations.
</div>

<div v-click>

**CRD**:
</div>

<div v-click>

- Define API group, kind, and schema.
</div>

<div v-click>

- Creates RESTful resource paths automatically.
</div>

<div v-click>

**AA**:
</div>

<div v-click>

- Main API server proxies requests to your custom API server.
</div>

<!-- 
Let us explore how to extend the Kubernetes API to support new use cases. Kubernetes is built to grow, and its API can be extended in two main ways: CustomResourceDefinitions, or CRDs, allow you to declaratively define new custom APIs with your own API group, kind, and schema. This creates new RESTful resource paths without needing a custom API server. Alternatively, API Aggregation, or AA, lets you deploy your own API server for specialized implementations, with the main API server acting as a proxy to forward requests to your custom server.
-->
---
transition: slide-left
---

# API Aggregation

<!-- 
  This diagram illustrates how API Aggregation works, showing the main API server proxying requests to a custom API server. 
  1. A request to `/apis/mygroup`.
  2. The kube-aggregator, embedded in the kube-apiserver, forwards the request.
  3. The extension API server, registered for `/apis/mygroup/*` and typically running as a pod, handles the request.
  4. The extension API server manages etcd storage if needed.
-->

<div v-click>
  <br/>
  <br/>
  <img src="./assets/k8s-aa.svg" alt="Kubernetes API Aggregation" style="width: 100%;">
</div>

---
transition: slide-left
layout: two-cols
hideInToc: true
---

# Choosing CRD or API Aggregation

<div v-click>

**CustomResourceDefinition (CRD)**:
</div>

<div v-click>

- Ideal for most use cases.
</div>

<div v-click>

- No need for a custom API server.
</div>

<div v-click>

- Simple to define and manage.
</div>

<div v-click>

**API Aggregation (AA)**:
</div>

<div v-click>

- Use when custom validations or existing API servers are needed.
</div>

<div v-click>

- Register via APIService to claim a URL path.
</div>
::right::
<div v-click>

Example CRD creation:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: myresources.example.com
spec:
  group: example.com
  names:
    kind: MyResource
    plural: myresources
  scope: Namespaced
```  
</div>
<!-- 
When deciding how to extend the Kubernetes API, you’ll choose between CRDs and API Aggregation. CRDs are the go-to choice for most scenarios because they’re simple to define, manage, and don’t require running a custom API server. They’re perfect for adding new resource types to your cluster. On the other hand, API Aggregation is better when you need custom validations or already have a program serving your API. You register an extension API server with an APIService to claim a URL path, and the kube-aggregator forwards requests to it. Here’s an example of a CRD definition, where we create a new resource type called MyResource in the example.com API group.
-->

---
transition: slide-left
---

# Kubebuilder Overview

<div v-click>
Kubebuilder is a framework from Kubernetes SIGs to build APIs using Custom Resource Definitions (CRDs).
</div>

<div v-click>
It scaffolds boilerplate code and structure to help build Kubernetes-native APIs.
</div>

<div v-click>
Install with Homebrew:
</div>

<div v-click>

```bash
brew install kubebuilder
```
</div>

<div v-click>
Initialize a project:

```bash
  mkdir my-operator
  cd my-operator
  kubebuilder init --domain mycoolcompany.io --repo github.com/my-operator
```
</div>


<!-- 
Kubebuilder is the official way to scaffold new Kubernetes APIs. It generates all necessary files and structure, so you can focus on logic. We start by installing it using Homebrew. Then, we initialize a project with our domain name, which helps define our API group.
-->


---
transition: slide-left
---

# Creating Your API

<div v-click>

Create a new API with `kubebuilder create api` .
</div>

<div v-click>
Define Group, Version, and Kind:
</div>

<div v-click>

```bash
kubebuilder create api --group app --version v1alpha1 --kind MyKind
```
</div>

<div v-click>

- Group is a namespace for related APIs.
</div>

<div v-click>

- Version defines API maturity (alpha, beta).
</div>

<div v-click>

- Kind is the type of object you want to manage.
</div>

<div v-click>

Generated structure includes:
</div>

<div v-click>
```bash
  $ ~/my-operator$ tree api/
  api/
  `-- v1alpha1
      |-- groupversion_info.go
      `-- mykind_types.go

  2 directories, 2 files
```
</div>

<!-- 
Once the project is initialized, we can generate our custom API with group, version, and kind. These define how Kubernetes will organize and recognize your resource. The directory structure generated includes boilerplate files, controller logic, and API definitions.
-->

---
transition: slide-left
---

# Marker Comments and Automation

<div v-click>
Kubebuilder relies on special Go comments called markers to generate OpenAPI schemas and CRDs.
</div>

<div v-click>

The tool behind this is `controller-gen`.
</div>

<div v-click>

Marker comments like `+kubebuilder:validation:Minimum=1` define schema validation rules.
</div>

<!-- 
Kubebuilder uses Go comments called marker comments to automate CRD generation. These comments are interpreted by the controller-gen tool to define schemas and validations, reducing manual YAML and error.
-->

---
transition: slide-left
hideInToc: true
---

# Kubebuilder Key Files

<div v-click>

Kubebuilder organizes code into logical files for each custom resource.
</div>

<div v-click>

Two files are particularly important:
</div>

<div v-click>

<code>
groupversion_info.go
</code> – defines API group and version.

</div>

<div v-click>

  ```go {all} twoslash
  GroupVersion = schema.GroupVersion { 
    Group: "app.mycoolcompany.io", Version: "v1alpha1"
  }
  ```
</div>

<div v-click>
This sets the unique identifier for your CRD.
</div>


<div v-click>

<code>mykind_types.go</code> – defines the structure and schema of your CRD.
</div>



<div v-click>


```go twoslash
type MyKindSpec struct {
  Foo string `json:"foo,omitempty"`
}

type MyKind struct {
  metav1.TypeMeta
  metav1.ObjectMeta
  Spec MyKindSpec
  Status MyKindStatus
}
```
</div>

<!-- 
Kubebuilder organizes your project in a predictable way. Two key files help define your custom resource. First is groupversion_info.go. This file sets the API group and version using the GroupVersion variable. For example, "app.projectsveltos.io" and "v1alpha1". This uniquely identifies your CRD.

The second file, mykind_types.go, is where your CRD’s schema lives. Inside it, you define Spec and Status structs that describe the desired and observed state of your resource. For example, Spec might contain a field named Foo. You also annotate the CRD with kubebuilder markers to auto-generate code and OpenAPI schemas. 

Together, these files form the core of how your CRD behaves and is understood by Kubernetes.
-->

---
transition: slide-left
---

# Defining Spec and Status in a CRD

<div v-click>
Once you've scaffolded the CRD, you're ready to customize its behavior.
</div>

<div v-click>

  Define the `MyKindSpec` and `MyKindStatus` structs inside `mykind_types.go`.
</div>

<div v-click>
Once defined, run:
</div>

<div v-click>
```bash
make manifests
```
</div>

<div v-click>

This will generate the CRD YAML file.
</div>

<div v-click>
That file will typically appear in:
</div>

<div v-click>

```bash
config/crd/bases/<group>_<resource>.yaml
```
</div>

<!-- 
Now that the CRD scaffolding is ready, it's time to define what the resource actually manages. You do this by filling out the `MyKindSpec` and `MyKindStatus` structs in the `mykind_types.go` file. These structs describe the desired and observed state of your custom resource. Once you're done, run `make manifests`, and Kubebuilder will generate the CRD YAML under the config directory. This is what Kubernetes will use to register your resource.
-->

---
transition: slide-left
---

# Making Custom Resources Work with client-go

<div v-click>

To interact with CRDs using client-go, your types must implement the `runtime.Object` interface.
</div>

<div v-click>
This interface ensures the object can be serialized/deserialized for API server communication.
</div>

<div v-click>

One key part of this is the ability to create deep copies of the object.
</div>

<div v-click>

This is handled automatically using a Kubebuilder marker:
</div>

<div v-click>

```go
// +kubebuilder:object:root=true
```
</div>

<!-- 
Kubernetes' client-go library expects your CRDs to implement the `runtime.Object` interface. This interface ensures that your objects can be safely encoded, decoded, and copied. Rather than writing that logic yourself, you can use the `+kubebuilder:object:root=true` marker. It signals Kubebuilder to generate those methods for you, including the important DeepCopy function.
-->

---
transition: slide-left
---

# Choosing Resource Scope

<div v-click>

Another important decision is the scope of your CRD.
</div>

<div v-click>

If the resource should apply across the whole cluster, use:
</div>

<div v-click>

```go
// +kubebuilder:resource:path=cleaners,scope=Cluster
```

</div>

<div v-click>

If it should apply only within a namespace, use:
</div>

<div v-click>

```go
// +kubebuilder:resource:path=cleaners,scope=Namespaced
```
</div>

<!-- 
When designing your CRD, consider who will use it and how. If it's meant for cluster-wide use—say by platform admins—define it with a Cluster scope. This way, a single resource can manage settings across all namespaces. On the other hand, if it's meant to be namespace-specific—perhaps for individual teams—use a Namespaced scope. Kubebuilder lets you declare this with a simple marker comment.
-->

---
transition: slide-left
---

# Designing the CRD Spec

<div v-click>

The `Spec` field defines the **desired state** of your custom resource.
</div>

<div v-click>

It exposes all user-configurable options and defaults.
</div>

<div v-click>

Let’s look at the [CronJob example](https://book.kubebuilder.io/cronjob-tutorial/api-design) from the kubebuilder book to understand Spec design in practice.
</div>

<div v-click>

In the CronJob CRD, users can configure several behaviors:
</div>

<div v-click>

1. When to run jobs (`schedule`)
</div>
<div v-click>

2. Retention settings (`successfulJobsHistoryLimit`, `failedJobsHistoryLimit`)
</div>

<div v-click>

3. Concurrency policy and suspend flag
</div>

<div v-click>
```go
type CronJobSpec struct {
    Schedule                   string `json:"schedule"`
    ConcurrencyPolicy          string `json:"concurrencyPolicy,omitempty"`
    Suspend                    *bool  `json:"suspend,omitempty"`
    SuccessfulJobsHistoryLimit *int32 `json:"successfulJobsHistoryLimit,omitempty"`
    FailedJobsHistoryLimit     *int32 `json:"failedJobsHistoryLimit,omitempty"`
}
```
</div>
<!--
The `Spec` field in your CRD defines what the user can configure—this is the desired state. A well-designed Spec provides flexibility while offering safe defaults. 
Let’s look at the CronJob example to understand Spec design in practice. Taking the CronJob example from Kubebuilder, you expose a schedule field that determines when the job should run. You also allow the user to control how many successful or failed jobs are retained, whether the job is suspended, and how concurrent jobs are managed.
-->
---
transition: slide-left
hideInToc: true
---

# Optional Fields and Defaults

<div v-click>

Some fields can be **optional**, with sensible **default values**.
</div>

<div v-click>
This allows your CRD to be user-friendly and flexible.
</div>

<div v-click>

To set a default value:
</div>

<div v-click>
```go
// +kubebuilder:default:=true
Suspend *bool `json:"suspend,omitempty"`
```

</div>
<div v-click>

To make a field optional:
</div>

<div v-click>
```go
// +optional
ConcurrencyPolicy string `json:"concurrencyPolicy,omitempty"`
```
</div>

<div v-click>

Here's the full list of [validation markers](https://book.kubebuilder.io/reference/markers/crd-validation.html?highlight=%2F%2F%20%2Bkubebuilder%3Avalidation%3AEnum#crd-validation).
</div>
<!--
You can make fields optional by using the `+optional` marker, and provide default values using the `+kubebuilder:default` marker. For instance, you might want jobs to be suspended by default, or allow concurrency policies to be defined only when needed.
This approach ensures your API is expressive and ergonomic.
-->
---
transition: slide-left
---

# Understanding the Status Subresource in a CRD

<div v-click>

Kubernetes allows resources to expose a separate endpoint just for their status.
</div>

<div v-click>

This is enabled using a special marker:
</div>

<div v-click>

<code>// +kubebuilder:subresource:status</code>
</div>

<!--
When defining a Kubernetes Custom Resource, you can add a status subresource to separate your resource's configuration from its current state. This makes it easier to monitor and manage changes independently and securely.
-->

---
transition: slide-left
hideInToc: true
---

# Why Use a Status Subresource?

<div v-click>

It allows the controller to report observed state independently.
</div>

<div v-click>

Main spec updates don't overwrite status data, and vice versa.
</div>

<div v-click>

You can apply RBAC to status separately from spec.
</div>

<div v-click>

- The <strong>Spec</strong> defines the desired state of the resource.
</div>

<div v-click>

- The <strong>Status</strong> reflects the observed state from the controller.
</div>

<div v-click>

<br/>

### Example: 

In a Cluster wide resource, the admin defines Spec.
The controller updates Status to show run history and results.

</div>
<!--
The status subresource provides a clean separation between user intent and system observation. You can grant different RBAC permissions for reading or updating the status, making it secure and modular. Updates to spec and status don’t interfere with each other, preventing accidental overwrites. In designing a CRD, you should always ask: who defines the Spec, and who updates the Status? For example, in a Cluster wide resource, platform admins define when and how Operation should occur using Spec. The controller then fills in the Status with last run time, success or failure messages.
-->

---
transition: slide-left
hideInToc: true
---

# CronJobStatus Structure
<div v-click>

Looking at the [CronJob example](https://book.kubebuilder.io/cronjob-tutorial/api-design) from the kubebuilder book, we see how to define the Status struct.
</div>
<div v-click>

Define fields you want the controller to expose:
</div>

<div v-click>

- Active jobs (list of job references)
</div>

<div v-click>

- Last successful schedule time
</div>

<div v-click>

```go
type CronJobStatus struct {
  Active []corev1.ObjectReference `json:"active,omitempty"`
  LastScheduleTime *metav1.Time   `json:"lastScheduleTime,omitempty"`
}
```
</div>

<!--
In the CronJob example from the kubebuiler book, the Status struct includes two important fields. First, the 'Active' field lists all jobs currently running. Second, 'LastScheduleTime' tells us the last time the job was successfully triggered. This gives platform admins real-time visibility into job execution.
-->

---
transition: slide-left
hideInToc: true
---

# Marking the Status Subresource

<div v-click>
Use this marker in the root CRD struct:
</div>

<div v-click>

<code>// +kubebuilder:subresource:status</code>

</div>

<div v-click>

This tells Kubernetes to treat status as a distinct subresource.
</div>

<div v-click>


#### Full Root Object Example

</div>

<div v-click>

```go
// +kubebuilder:object:root=true
// +kubebuilder:subresource:status
type CronJob struct {
  metav1.TypeMeta   `json:",inline"`
  metav1.ObjectMeta `json:"metadata,omitempty"`
  Spec   CronJobSpec   `json:"spec,omitempty"`
  Status CronJobStatus `json:"status,omitempty"`
}
```
</div>

<!--
To enable the status subresource, simply add the kubebuilder marker at the top of your CRD definition. This ensures Kubernetes will treat 'status' as a separate endpoint, letting you manage it independently from the main resource configuration. This is the full root object definition for a CronJob resource, complete with the status subresource enabled. Notice the two kubebuilder markers at the top — one indicates it’s a root object, and the other enables the status subresource. With these in place, Kubernetes knows how to handle your resource in a fully native way.
-->
---
title: Installing the CRD
---

# Installing the CRD

<div v-click>

Once done defining Spec and Status, just run 

```bash
make generate
```

</div>

<div v-click>
Next run 
```bash
make manifests
```
</div>

<div v-click>

This will generate the CRD at:
```bash
config/crd/bases/app.mycoolcompany.io_mykinds.yaml
```

Use `kubectl` to apply it to your cluster, or simply use:

```bash
make install
```

</div>
<div v-click>
Once a CRD is posted, `apiextensions-apiserver` in kube-apiserver validates it. Check the status of the CRD using:
<div v-click>

```bash
kubectl get crds mykinds.app.mycoolcompany.io -oyaml
```
</div>
</div>
<!--
Voice-over: Now that you've defined the Spec and Status for your Kubernetes Custom Resource, the next step is to run the `make generate` command. This command triggers controller-gen behind the scenes to generate boilerplate code.
After generating the necessary code, run `make manifests` to produce the CustomResourceDefinition YAML file.
The generated CRD can be applied to your cluster using `kubectl`, or you can streamline the process by using `make install`.
When you post a CRD to the cluster, the apiextensions-apiserver validates the request for conflicts and correctness. It then updates the CRD's status field with the result.
-->

---
transition: slide-left
hideInToc: true
---

# Example output:
<div v-click>
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: mykinds.app.mycoolcompany.io
...
status:
  acceptedNames:
    kind: MyKind
    listKind: MyKindList
    plural: mykinds
    singular: mykind
  conditions:
  - lastTransitionTime: "2025-05-02T08:48:46Z"
    message: no conflicts found
    reason: NoConflicts
    status: "True"
    type: NamesAccepted
  - lastTransitionTime: "2025-05-02T08:48:46Z"
    message: the initial names have been accepted
    reason: InitialNamesAccepted
    status: "True"
    type: Established
  storedVersions:
  - v1alpha1
```
</div>
<!--
This YAML output shows that the CRD was successfully validated and established. The status field confirms that there were no conflicts and that the names were accepted.
-->

---
title: Common Expression Language (CEL)
transition: slide-left
---

# Common Expression Language (CEL)

<!--
Let us now introduce the Common Expression Language, or CEL.
It's a powerful feature that lets you write validation rules directly inside your Kubernetes CustomResourceDefinitions.
Since Kubernetes v1.25, CEL support is available in beta and lets you express constraints clearly and declaratively.
Marker `//+kubebuilder:validation:XValidation:rule` can be used for this scope.
-->

<div v-click>

For ensuring your CRD configurations are well-defined, you can leverage marker comments with `Common Expression Language` (`CEL`). Since Kubernetes v1.25 introduced CEL support for validation in beta, you can now write expressions to validate your custom resources.

Marker `//+kubebuilder:validation:XValidation:rule` can be used for this scope.

</div>

---

## Immutability

<!--
Here is an example on how to make a field immutable using CEL.
The validation rule ensures the value of 'Schedule' doesn't change after creation.
If it does, the update is rejected with a clear error message.
self refers to the current object, while oldSelf refers to the previous version.
-->

<div v-click>

```yaml
//+kubebuilder:validation:XValidation:rule="self == oldSelf",message="Value is immutable"
Schedule string `json:"schedule"`
```

If I tried to update my instance changing the _schedule_ field, the update would fail:

```bash
spec.schedule: Invalid value: "string": Value is immutable
```

</div>

---
hideInToc: true
transition: slide-left
---

## Append-only list

<!--
Here we can define a sample Selectors list that can only grow.
The rule checks that the new list size is not smaller than the old one, enforcing append-only behavior.
-->


<div v-click>
```yaml
//+kubebuilder:validation:XValidation:rule="size(self) >= size(oldSelf)",message="this list is append only"
Selectors []Selector `json:"selectors"`
```

Any update reducing that list would fail:

```bash
spec.selectors: Invalid value: "array": this list is append only
```
</div>

---
hideInToc: true
transition: slide-left
---

## Name format validation

<!--
Let us look at a simple example of validating the name format using CEL rules.
The rule enforces that resource names must start with a specific prefix.
-->

<div v-click>

```yaml
type MyKind struct { //+kubebuilder:validation:XValidation:rule=self.metadata.name.startsWith("my-prefix")
```

Creating an incorrect instance fails:

```bash
<nil>: Invalid value: "object": failed rule: self.metadata.name.startsWith("my-prefix")
```

</div>
---
hideInToc: true
transition: slide-left
---

## Pattern-based string validation

<!--
You can also validate field content using regex patterns.
This rule ensures that the 'description' field follows a naming convention: starts with a letter or underscore and only includes valid characters.
-->
<div v-click>

```yaml
// +kubebuilder:validation:Pattern=`^[A-Za-z_][A-Za-z0-9_]*$`
Description string `json:"description"`
```

This ensures `description` starts with a letter or underscore and only contains letters, numbers, and underscores.

</div>
---
hideInToc: true
transition: slide-left
---

## Date-time validation

<!--
To ensure correct date and time formatting, use the 'Format' marker.
This rule enforces RFC 3339 compliance for date-time values.
-->

<div v-click>
```yaml
//+kubebuilder:validation:Format="date-time"
TimeOfX string `json:"timeOfX"`
```

A valid value: `"2024-06-03T15:29:48Z"`, invalid: `"2024"`

</div>
---
hideInToc: true
transition: slide-left
---

## Comparing different fields

<!--
CEL rules can also compare multiple fields in a resource.
In this example, 'minReplicas' must always be less than or equal to 'replicas'.
-->
<div v-click>

```yaml
// +kubebuilder:validation:XValidation:rule=self.minReplicas <= self.replicas
type MyKindSpec struct {
  Replicas int `json:"replicas"`
  MinReplicas int `json:"minReplicas"`
}
```
</div>

<div v-click>

This rule enforces that `minReplicas` is always less than or equal to `replicas`.

For more info: https://kubernetes.io/docs/reference/using-api/cel/
</div>

---
title: Additional Printer Columns and Validation Ratcheting
hideInToc: false
transition: slide-left
---

# Additional Printer Columns

<div v-click>

The `+kubebuilder:printcolumn` marker lets you define extra columns shown when using `kubectl get`. This improves visibility directly from the CLI.

```yaml
//+kubebuilder:printcolumn:name="Ready",type="boolean",JSONPath=".status.ready",
description="Indicates whether your resource is in ready state"
```
</div>
<div v-click>

```bash
$ kubectl get mykinds -A

NAMESPACE   NAME   READY 
default     sample true   
```
</div>
<!-- Use the print column marker to enhance how users see your custom resource status in the CLI. 
It's especially helpful for surfacing readiness, state, or summary info directly in the kubectl output. -->
---
title: Final Remarks
transition: slide-left
---


# Final Remarks

<div v-click>

<br/>

# Validation Ratcheting

Kubernetes supports `validation ratcheting` when adding new validations to an existing CRD. 
This allows updates, as long as the parts of the object that fail validation are not touched by the update.
</div>

<div v-click>

# Deleting a CustomResourceDefinition

Deleting a CRD removes its REST API and deletes all associated custom objects. 
Recreating it will start fresh.
</div>

<div v-click>

# Conclusion
CRDs let you store and retrieve structured data. 
That's often enough. But combining a CRD with a controller adds automation. 
Note that some controllers don’t require new CRDs—they can watch existing Kubernetes resources.


</div>

<!-- Validation ratcheting lets you evolve your CRD schemas safely. If old data is invalid under a new schema, updates can still go through as long as the invalid parts aren't changed. This provides schema upgrade safety without breaking users. -->

<!-- Be careful when deleting CRDs. Not only does it remove the API endpoint, it also wipes out all custom objects. Always back up if you need to preserve anything. -->

<!-- CRDs are great for extending Kubernetes, but they’re just the start. Add a controller if you want automation. Also remember, not every controller needs a CRD—many just respond to built-in resources like Pods or ConfigMaps. -->

---
