class ABAC {
  constructor() {
    this.ROLES = {
      admin: {
        comments: {
          view: true,
          create: true,
          update: true,
        },
        todos: {
          view: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      moderator: {
        comments: {
          view: true,
          create: true,
          update: true,
        },
        todos: {
          view: true,
          create: true,
          update: true,
          delete: (user, todo) => todo.completed,
        },
      },
      user: {
        comments: {
          view: (user, comment) => !user.blockedBy.includes(comment.authorId),
          create: true,
          update: (user, comment) => comment.authorId === user.id,
        },
        todos: {
          view: (user, todo) => !user.blockedBy.includes(todo.userId),
          create: true,
          update: (user, todo) =>
            todo.userId === user.id || todo.invitedUsers.includes(user.id),
          delete: (user, todo) =>
            (todo.userId === user.id || todo.invitedUsers.includes(user.id)) &&
            todo.completed,
        },
      },
    };
  }

  /**
   * Checks if a user has a specific permission for a resource.
   * @param {Object} user - The user object.
   * @param {string} resource - The resource name.
   * @param {string} action - The action to be performed.
   * @param {Object} [data] - Additional data for permission check.
   * @returns {boolean} - True if the user has permission, false otherwise.
   */
  hasPermission(user, resource, action, data) {
    const result = user.roles.some((role) => {
      const permission = this.ROLES[role][resource]?.[action];
      if (permission == null) return false;

      if (typeof permission === "boolean") return permission;
      return data != null && permission(user, data);
    });

    this.logPermissionResult(result);
    return result;
  }

  /**
   * Logs the result of the permission check.
   * @param {boolean} result - The result of the permission check.
   */
  logPermissionResult(result) {
    if (result) {
      console.log("Access granted ✅");
    } else {
      console.log("Access denied ❌");
    }
  }
}

// Example usage
const abac = new ABAC();
const user = { blockedBy: ["2"], id: "1", roles: ["user"] };
const todo = {
  completed: false,
  id: "3",
  invitedUsers: [],
  title: "Test Todo",
  userId: "1",
};

// Can create a comment
abac.hasPermission(user, "comments", "create");

// Can view the `todo` Todo
abac.hasPermission(user, "todos", "view", todo);

// Can view all todos
abac.hasPermission(user, "todos", "view");
