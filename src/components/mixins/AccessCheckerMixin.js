import checkRouteAccess from "@/utils/RouteAccessChecker";

export const AccessChecker = {
  methods: {
    /**
     *
     * @param {String} route_name
     * @returns
     */
    canAccess: function (route_name) {
      //Get route for a given name
      const { route } = this.$router.resolve({ name: route_name });
      const { granted } = checkRouteAccess(route);

      return granted;
    },
  },
};
