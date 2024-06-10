export const ImageProvider = {
    methods: {
        /**
         * 
         * @param {String} name 
         * @returns {String} - The image src or null if the image is not found
         */
        getImageSrcByName: function (name) {
            /**
             * @type {name: string, src: string}
             */
            const image = this.$store.getters['getImageByName'](name);
            //Return the image.src if src is define, null otherwise
            return image ? `${this.$store.state.cdn}/${image.src}` : null;
        }
    },
};
