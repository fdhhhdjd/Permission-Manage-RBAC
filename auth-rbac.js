class RBAC {
  constructor() {
    this.ROLES = {
      admin: [
        "view:comments",
        "create:comments",
        "update:comments",
        "delete:comments",
      ],
      moderator: ["view:comments", "create:comments", "delete:comments"],
      user: ["view:comments", "create:comments"],
    };
  }

  // Method to check if a user has a specific permission
  hasPermission(user, permission) {
    if (!permission || !user) {
      throw new Error("You do not have permission to perform this action");
    }

    const resultPermission = user.roles.some((role) =>
      this.ROLES[role].includes(permission)
    );
    this.logPermissionResult(resultPermission);
    return resultPermission;
  }

  // Method to log the result of the permission check
  logPermissionResult(result) {
    if (result) {
      console.log("Access granted ✅");
    } else {
      console.log("Access denied ❌");
    }
  }
}

// Example usage
const rbac = new RBAC();
const user = { id: 1, roles: ["user"] };

// Check if the user can create comments
rbac.hasPermission(user, "create:comments");
rbac.hasPermission(user, "update:comments");
