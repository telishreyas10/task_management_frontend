<template>
  <form>
    <div class="form-container">
      <div>
        <label>Task Name</label>
        <input
          type="text"
          v-model="task.name"
          name="name"
          :readonly="task.status && task.status !== 'assigned'"
        />
      </div>
      <div>
        <label>Details</label>
        <textarea
          v-model="task.details"
          name="description"
          :readonly="task.status && task.status !== 'assigned'"
        ></textarea>
      </div>
      <div>
        <div class="left">
          <label>Assigned date</label>
          <input
            type="datetime-local"
            v-model="selected_assigned"
            name="assigned"
            :readonly="task.status && task.status !== 'assigned'"
          />

          <label>Due date</label>
          <input
            type="datetime-local"
            v-model="selected_due"
            name="due"
            :readonly="task.status && task.status !== 'assigned'"
          />
        </div>
      </div>
      <div>
        <label>Status</label>
        <select v-model="selected_status">
          <option v-for="status in statuses" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
      <div>
        <label>Priority</label>
        <select v-model="selected_priority">
          <option
            v-for="priority in priorities"
            :value="priority"
            :disabled="task.status && task.status !== 'assigned'"
          >
            {{ priority }}
          </option>
        </select>
      </div>
      <div>
        <label>User</label>
        <select v-model="selected_user">
          <option
            v-for="user in available_users"
            :value="user._id"
            :disabled="task.status && task.status !== 'assigned'"
          >
            {{ user.name }}
          </option>
        </select>
      </div>
      <div>
        <label>Project</label>
        <input type="text" :value="project_name" readonly />
      </div>
      <div>
        <input
          type="button"
          v-if="task._id"
          @click="updateTask"
          value="Update Task"
        />
        <input
          type="button"
          v-if="task._id"
          @click="deleteTask"
          value="Delete Task"
        />
        <input type="button" v-else @click="addTask" value="Add Task" />
      </div>
    </div>
  </form>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "TaskForm",
  props: {
    task: Object,
    project_id: String,
    project_name: String,
    priorities: Array,
    statuses: Array,
    available_users: Array,
  },
  data() {
    return {
      task_data: {},
      selected_priority: "",
      selected_status: "",
      selected_user: "",
      selected_assigned: "",
      selected_due: "",
    };
  },
  methods: {
    async addTask() {
      const data = {
        project: this.project_id,
        name: this.task.name,
        details: this.task.details,
        priority: this.selected_priority,
        status: this.selected_status,
        timeline: {
          assigned_date: this.selected_assigned,
          due_date: this.selected_due,
          last_updated_date: new Date().toISOString(),
        },
        assignee: this.selected_user,
      };

      // view this console.log in your browser
      console.log(JSON.stringify(data));

      try {
        const res = await axios
          .post(`http://localhost:8080/tasks`, data)
          .catch((err) => {
            if (err.response.status !== 200) {
              window.alert(err.response.data.error);
            }
          });
      } catch (err) {
        console.log(err);
      }
      this.$emit("close", "closeModal");
    },
    async updateTask() {
      // create a data object just like in addProject
      const data = {
        project: this.project_id,
        name: this.task.name,
        details: this.task.details,
        priority: this.selected_priority,
        status: this.selected_status,
        timeline: {
          assigned_date: this.selected_assigned,
          due_date: this.selected_due,
          last_updated_date: new Date().toISOString(),
        },
        assignee: this.selected_user,
      };

      // view this console.log in your browser
      console.log(data);

      try {
        const res = await axios
          .put(`http://localhost:8080/tasks/${this.task._id}`, data)
          .catch((err) => {
            if (err.response.status !== 200) {
              window.alert(err.response.data.error);
            }
          });
      } catch (err) {
        console.log(err);
      }
      this.$emit("close", "closeModal");
    },
    async deleteTask() {
      try {
        const res = await axios
          .delete(`http://localhost:8080/tasks/${this.task._id}`)
          .catch((err) => {
            if (err.response.status !== 200) {
              window.alert(err.response.data.error);
            }
          });
      } catch (err) {
        console.log(err);
      }
      this.$emit("close", "closeModal");
    },
  },
  async beforeRouteEnter(to, from, next) {
    next(function (vm) {
      //   return vm.setData(task);
    });
  },
  async beforeCreate() {
    console.log("inside TaskForm", this.project_id);
  },
  async created() {
    console.log(this.task);
    if (typeof this.task.name !== "undefined") {
      this.selected_priority = this.task.priority;
      this.selected_status = this.task.status;
      this.selected_user = this.task.assignee.id;
      this.selected_assigned = moment(this.task.timeline.assigned_date).format(
        "YYYY-MM-DDThh:mm"
      );
      this.selected_due = moment(this.task.timeline.due_date).format(
        "YYYY-MM-DDThh:mm"
      );
    }
  },
};
</script>

<style>
.form-container {
  padding: 25px;
}

form {
  margin: 0px auto;
  width: 100%;
  height: auto;
  background: #fff;
}

form label {
  font-size: 14px;
  color: #888;
  cursor: pointer;
}

form input,
form textarea,
form select {
  margin: 5px 0;
  padding: 8px;
  width: 95%;
  border: 1px solid #333;
  border-radius: 5px;
  display: block;
}

input[type="button"] {
  background: #2b2d42;
  border: 1px solid #000;
  color: #fff;
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  display: inline;
  width: 33%;
  margin-right: 10px;
}

input[type="button"]:hover {
  background: #8d99ae;
  color: #111;
}
</style>
