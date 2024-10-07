export const ImageProvider = {
    methods: {
        /**
         * Get the full image URL by name
         * @param {string} name Image name
         * @returns {string|null} The full image URL or null if the image is not found
         */
        getImageSrcByName(name) {
            /**
             * @type {{name: string, src: string} | undefined}
             */
            const image = this.$store.getters['getImageByName'](name);
            
            if (!image || !image.src) {
                return null;
            }

            return `${this.$store.state.cdn}/${image.src}`;
        }
    },
};

