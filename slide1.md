---
transition: slide-left
layout: two-cols
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

::right::

<div v-click>
<br/>


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

<div v-click>
  <br/>
  <br/>
  <img src="./assets/k8s-aa.svg" alt="Kubernetes API Aggregation" style="width: 100%;">
</div>
<!-- 
Let us explore how to extend the Kubernetes API to support new use cases. Kubernetes is built to grow, and its API can be extended in two main ways: CustomResourceDefinitions, or CRDs, allow you to declaratively define new custom APIs with your own API group, kind, and schema. This creates new RESTful resource paths without needing a custom API server. Alternatively, API Aggregation, or AA, lets you deploy your own API server for specialized implementations, with the main API server acting as a proxy to forward requests to your custom server. The diagram illustrates how API Aggregation works, showing the main API server proxying requests to a custom API server. 
  1. A request to `/apis/mygroup`.
  2. The kube-aggregator, embedded in the kube-apiserver, forwards the request.
  3. The extension API server, registered for `/apis/mygroup/*` and typically running as a pod, handles the request.
  4. The extension API server manages etcd storage if needed.
-->

---
transition: slide-left
layout: two-cols
hideInToc: false
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
---
# Kubebuilder Key Files

<div v-click>
Kubebuilder organizes code into logical files for each custom resource.
</div>

<div v-click>
Two files are particularly important:
</div>

<div v-click>
<code>groupversion_info.go</code> – defines API group and version.
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

```bash
make manifests
```

This will generate the CRD YAML file.
</div>

<div v-click>
That file will typically appear in:
</div>

<div v-click>

```
config/crd/bases/<group>_<resource>.yaml
```

</div>

<!-- 
Now that the CRD scaffolding is ready, it's time to define what the resource actually manages. You do this by filling out the `MyKindSpec` and `MyKindStatus` structs in the `mykind_types.go` file. These structs describe the desired and observed state of your custom resource. Once you're done, run `make manifests`, and Kubebuilder will generate the CRD YAML under the config directory. This is what Kubernetes will use to register your resource.
-->

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
layout: two-cols
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

::right::

<div v-click>

The <strong>Spec</strong> defines the desired state of the resource.
</div>

<div v-click>

The <strong>Status</strong> reflects the observed state from the controller.
</div>

<div v-click>

Example: In a Cluster wide resource, the admin defines Spec.
</div>

<div v-click>

The controller updates Status to show run history and results.
</div>

<!--
The status subresource provides a clean separation between user intent and system observation. You can grant different RBAC permissions for reading or updating the status, making it secure and modular. Updates to spec and status don’t interfere with each other, preventing accidental overwrites. In designing a CRD, you should always ask: who defines the Spec, and who updates the Status? For example, in a Cluster wide resource, platform admins define when and how Operation should occur using Spec. The controller then fills in the Status with last run time, success or failure messages.
-->

---
transition: slide-left
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
