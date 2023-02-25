<template>
  <v-progress-circular indeterminate v-if="!project_data.name"></v-progress-circular>
  <div v-if="project_data.name">
    <div class="row">
      <div class="column-left">
        <strong style="font-size: 40px">{{ project_data.name }}</strong> <br />
        {{ project_data.description }} <br />

        <v-tooltip text="Manager" location="start">
          <template v-slot:activator="{ props }">
            <v-chip class="ma-2" v-if="project_data.manager" v-bind="props">
              <v-icon start icon="mdi-account-tie"></v-icon>
              {{
                project_data.manager.first_name +
                " " +
                project_data.manager.last_name
              }}
            </v-chip>
          </template>
        </v-tooltip>

        <v-tooltip text="Repository" location="right">
          <template v-slot:activator="{ props }">
            <v-chip class="ma-2" v-bind="props">
              <v-icon start icon="mdi-github"></v-icon>
              {{ project_data.repository }}
            </v-chip>
          </template>
        </v-tooltip>
      </div>
      <hr />
      <div>
        <!-- <v-table>
                <tr>
                    <td><th class="text-left">Assigned</th></td>
                    <td><th class="text-left">In Progress</th></td>
                    <td><th class="text-left">In Review</th></td>
                    <td><th class="text-left">Completed</th></td>
                </tr>
                <tr>
                    <td v-for="assigned in assigned_tasks">{{assigned ? assigned.name: ''}}</td>
                    <td v-for="inprog in inProgress_tasks">{{inprog ? inprog.name: ''}}</td>
                    <td v-for="inrev in inReview_tasks">{{inrev ? inrev.name: ''}}</td>
                    <td v-for="compl in completed_tasks">{{compl ? compl.name: ''}}</td>
                </tr>
            </v-table> -->
      </div>

      <div class="column-right">
        <br />
        <div>
          <v-btn @click="openTaskModal()" variant="tonal">
            <v-icon icon="mdi-plus"></v-icon>Add task</v-btn
          >
        </div>
        <br />

        <Modal
          v-if="showModal"
          v-bind:task="add_task"
          v-bind:project_name="project_data.name"
          v-bind:project_id="project_data.id"
          v-bind:priorities="priorities"
          v-bind:statuses="statuses"
          v-bind:available_users="available_users"
          @closeModal="closeModal"
        />
      </div>
    </div>

    <section class="lists-container">
      <div class="list">
        <h3 class="list-title">Assigned</h3>
        <ul class="list-items">
          <li
            v-for="assigned in assigned_tasks"
            @click="openTaskModal(assigned)"
          >
            {{ assigned ? assigned.name : "" }}
            <br /><br />
            <v-icon :class="assigned.priority">{{
              assigned.priority === "high"
                ? `mdi-arrow-up`
                : assigned.priority === "medium"
                ? `mdi-arrow-up`
                : `mdi-arrow-down`
            }}</v-icon>
            <v-avatar :class="assigned.status" color="purple"
              ><span class="text-h7">{{
                assigned.assignee.first_name.substring(0, 1) +
                assigned.assignee.last_name.substring(0, 1)
              }}</span>
            </v-avatar>
          </li>
        </ul>
      </div>

      <div class="list">
        <h3 class="list-title">In Progress</h3>
        <ul class="list-items">
          <li v-for="inprog in inProgress_tasks" @click="openTaskModal(inprog)">
            {{ inprog ? inprog.name : "" }}
            <br /><br />
            <v-icon :class="inprog.priority">{{
              inprog.priority === "high"
                ? `mdi-arrow-up`
                : inprog.priority === "medium"
                ? `mdi-arrow-up`
                : `mdi-arrow-down`
            }}</v-icon>
            <v-avatar :class="inprog.status" color="red"
              ><span class="text-h7">{{
                inprog.assignee.first_name.substring(0, 1) +
                inprog.assignee.last_name.substring(0, 1)
              }}</span>
            </v-avatar>
          </li>
        </ul>
      </div>

      <div class="list">
        <h3 class="list-title">In Review</h3>
        <ul class="list-items">
          <li v-for="inrev in inReview_tasks" @click="openTaskModal(inrev)">
            {{ inrev ? inrev.name : "" }}
            <br /><br />
            <v-icon :class="inrev.priority">{{
              inrev.priority === "high"
                ? `mdi-arrow-up`
                : inrev.priority === "medium"
                ? `mdi-arrow-up`
                : `mdi-arrow-down`
            }}</v-icon>
            <v-avatar :class="inrev.status" color="blue"
              ><span class="text-h7">{{
                inrev.assignee.first_name.substring(0, 1) +
                inrev.assignee.last_name.substring(0, 1)
              }}</span>
            </v-avatar>
          </li>
        </ul>
      </div>

      <div class="list">
        <h3 class="list-title">Completed</h3>
        <ul class="list-items">
          <li v-for="compl in completed_tasks" @click="openTaskModal(compl)">
            {{ compl ? compl.name : "" }}
            <br /><br />
            <v-icon :class="compl.priority">{{
              compl.priority === "high"
                ? `mdi-arrow-up`
                : compl.priority === "medium"
                ? `mdi-arrow-up`
                : `mdi-arrow-down`
            }}</v-icon>
            <v-avatar :class="compl.status" color="green"
              ><span class="text-h7">{{
                compl.assignee.first_name.substring(0, 1) +
                compl.assignee.last_name.substring(0, 1)
              }}</span>
            </v-avatar>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  name: "Detail",
  components: {
    Modal,
  },
  data() {
    return {
      project_data: {},
      assigned_tasks: [],
      inProgress_tasks: [],
      inReview_tasks: [],
      completed_tasks: [],
      priorities: [],
      statuses: [],
      available_users: [],

      add_task: {},
      showModal: false,
      refreshData: false,
    };
  },
  methods: {
    setData(
      project,
      assigned,
      inprogress,
      inreview,
      completed,
      priorities,
      statuses,
      filtered_users
    ) {
      this.project_data = { ...project };
      console.log(this.project_data);

      this.assigned_tasks = assigned;
      this.inProgress_tasks = inprogress;
      this.inReview_tasks = inreview;
      this.completed_tasks = completed;

      this.priorities = priorities;
      this.statuses = statuses;
      console.log(this.assigned_tasks);
    },
    async fetchDetailPageData(identifier) {
      const projRes = await fetch(
        `http://localhost:8080/projects/${identifier}`
      );
      const project = await projRes.json();

      // get all users who are available to be associated to the project
      const priorityRes = await fetch(`http://localhost:8080/tasks/priorities`);
      const priorities = await priorityRes.json();

      // get all users who are available to be associated to the project
      const statusRes = await fetch(`http://localhost:8080/tasks/statuses`);
      const statuses = await statusRes.json();

      const userRes = await fetch(`http://localhost:8080/users?isActive=true`);
      const user_data = await userRes.json();

      const filtered_users = user_data.filter((user) => {
        return user.title !== "Manager";
      });

      const assigned = await project.tasks.filter((task) => {
        return task.status === "assigned";
      });

      const inprogress = await project.tasks.filter((task) => {
        return task.status === "in progress";
      });

      const inreview = await project.tasks.filter((task) => {
        return task.status === "in review";
      });

      const completed = await project.tasks.filter((task) => {
        return task.status === "completed";
      });

      return {
        project: project,
        assigned: assigned,
        inprogress: inprogress,
        inreview: inreview,
        completed: completed,
        priorities: priorities,
        statuses: statuses,
        filtered_users: filtered_users,
      };
    },
    async openTaskModal(task) {
      if (typeof task !== "undefined") {
        const taskRes = await fetch(`http://localhost:8080/tasks/${task._id}`);
        const task_data = await taskRes.json();

        // create an empty task object with the associated project id and empty timeline object
        this.add_task = { ...task_data };
      } else {
        this.add_task = { timeline: {} };
      }

      const usersRes = this.project_data.users;
      this.available_users = usersRes.map((user) => {
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
    const identifier = to.params.identifier;
    next(async function (vm) {
      const {
        project,
        assigned,
        inprogress,
        inreview,
        completed,
        priorities,
        statuses,
        filtered_users,
      } = await vm.fetchDetailPageData(identifier);

      return vm.setData(
        project,
        assigned,
        inprogress,
        inreview,
        completed,
        priorities,
        statuses,
        filtered_users
      );
    });
  },
  async beforeUpdate() {
    if (this.refreshData) {
      const {
        project,
        assigned,
        inprogress,
        inreview,
        completed,
        priorities,
        statuses,
        filtered_users,
      } = await this.fetchDetailPageData(this.project_data.id);

      this.setData(
        project,
        assigned,
        inprogress,
        inreview,
        completed,
        priorities,
        statuses,
        filtered_users
      );
    }
    this.refreshData = false;
  },
};
</script>

<style>
/* Lists */

.lists-container {
  display: flex;
  align-items: start;
  padding: 0 0.8rem 0.8rem;
  overflow-x: auto;
  height: calc(100vh - 8.6rem);
  text-align: center;
}

.list {
  flex: 0 0 15rem;
  display: flex;
  flex-direction: column;
  background-color: #e2e4e6;
  max-height: calc(100vh - 11.8rem);
  border-radius: 0.3rem;
  margin-right: 1rem;
  height: 85%;
}

.list-title {
  font-size: 1.2rem;
  font-weight: 650;
  color: #333;
  padding: 1rem;
}

.list-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-content: start;
  padding: 0 0.6rem 0.5rem;
  overflow-y: auto;
}

.list-items::-webkit-scrollbar {
  width: 1.6rem;
}

.list-items::-webkit-scrollbar-thumb {
  background-color: #c4c9cc;
  border-right: 0.6rem solid #e2e4e6;
}

.list-items li {
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.3;
  background-color: #fff;
  padding: 0.65rem 0.6rem;
  color: #4d4d4d;
  border-bottom: 0.1rem solid #ccc;
  border-radius: 0.3rem;
  margin-bottom: 0.6rem;
  word-wrap: break-word;
  cursor: pointer;
  text-align: left;
}

.list-items li:last-of-type {
  margin-bottom: 0;
}

.list-items li:hover {
  background-color: #eee;
}

.high {
  color: red;
}
.medium {
  color: orange;
}
.low {
  color: green;
}
.assigned,
.in.progress,
.in.review,
.completed {
  float: right;
}
</style>
