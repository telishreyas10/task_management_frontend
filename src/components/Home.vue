<template>
  <div class="text-h3"><strong>Projects</strong></div>
  <br />

  <v-progress-circular
    indeterminate
    v-if="project_data.length === 0"
  ></v-progress-circular>

  <div v-if="project_data.length > 0">
    <div v-for="project in project_data">
      <RouterLink
        class="btn"
        style="text-decoration: none; color: inherit"
        tag="p"
        :to="`/details/${project.id}`"
      >
        <v-card width="500" variant="tonal">
          <v-card-item>
            <v-card-title>
              <strong> {{ project.name }} </strong></v-card-title
            >

            <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          </v-card-item>

          <v-card-actions class="d-flex flex-row-reverse">
            <v-btn
              icon="mdi-pencil"
              size="small"
              @click.prevent.self
              @click="editProject(project)"
            ></v-btn>
          </v-card-actions> </v-card
        ><br />
      </RouterLink>
    </div>
  </div>

  <Modal
    v-if="showModal"
    v-bind:project="selected_project"
    v-bind:available_managers="available_managers"
    v-bind:available_users="available_users"
    @closeModal="closeModal"
  />
</template>

<script>
import Modal from "./Modal.vue";
import { useRouter } from "vue-router";
const router = useRouter();
export default {
  name: "Container",
  components: {
    Modal,
  },
  data() {
    return {
      project_data: [],
      selected_project: {},
      available_managers: [],
      available_users: [],
      showModal: false,
      refreshData: false,
    };
  },
  methods: {
    setData(project) {
      this.project_data = project;
    },
    async editProject(project) {
      const projRes = await fetch(
        `https://task-management-dcvg.onrender.com/${project.id}`
      );
      const proj_data = await projRes.json();

      const userRes = await fetch(`https://task-management-dcvg.onrender.com/users?isActive=true`);
      const user_data = await userRes.json();

      const filtered_managers = user_data.filter((user) => {
        return user.title === "Manager";
      });
      const filtered_users = user_data.filter((user) => {
        return user.title !== "Manager";
      });

      this.selected_project = { ...proj_data };

      this.available_managers = await filtered_managers.map((user) => {
        return {
          _id: user._id,
          name: `${user.first_name} ${user.last_name}`,
        };
      });

      this.available_users = await filtered_users.map((user) => {
        return {
          _id: user._id,
          name: `${user.first_name} ${user.last_name}`,
        };
      });

      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.refreshData = true;
    },
  },
  async beforeRouteEnter(to, from, next) {
    const projRes = await fetch(`https://task-management-dcvg.onrender.com/projects`);
    const projects = await projRes.json();

    next(function (vm) {
      return vm.setData(projects);
    });
  },
  async beforeUpdate() {
    if (this.refreshData) {
      const projRes = await fetch(`https://task-management-dcvg.onrender.com/projects`);
      const projects = await projRes.json();
      this.project_data = projects;
    }
    this.refreshData = false;
  },
};
</script>
