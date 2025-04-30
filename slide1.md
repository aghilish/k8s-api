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
layout: center
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
