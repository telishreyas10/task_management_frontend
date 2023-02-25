<template>
  <div class="modal-container">
    <div class="modal">
      <ProjectForm
        v-if="project"
        v-bind:project="project"
        v-bind:available_managers="available_managers"
        v-bind:available_users="available_users"
        @hide="closeModal"
      />
      <TaskForm
        v-if="task"
        v-bind:task="task"
        v-bind:project_id="project_id"
        v-bind:project_name="project_name"
        v-bind:priorities="priorities"
        v-bind:statuses="statuses"
        v-bind:available_users="available_users"
        @close="closeModal"
      />

      <button class="close-modal" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
import TaskForm from "./TaskForm.vue";
import ProjectForm from "./ProjectForm.vue";
export default {
  name: "Modal",
  components: {
    ProjectForm,
    TaskForm,
  },
  props: {
    task: Object,
    project: Object,
    available_users: Array,
    available_managers: Array,
    project_name: String,
    project_id: String,
    priorities: Array,
    statuses: Array,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
  async created() {
    console.log("inside Modal", this.project_id);
  },
};
</script>

<style>
.modal-container {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(1px);
  z-index: 9999;
  text-align: center;
}

.modal {
  background-color: #fff;
  border: 1px solid #000;
  width: 700px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.close-modal {
  background: #aaa;
  border: 1px solid #999;
  color: #fff;
  border-radius: 50px;
  cursor: pointer;
  font-size: 12px;
  display: block;
  width: 50px;
  padding: 2px;
  margin: 20px auto;
}

.close-modal:hover {
  background: #555;
}
</style>
