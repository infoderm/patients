const pageQuery = (Collection) =>
	function (query, options) {
		const selector = {...query, owner: this.userId};
		if (options && options.skip) {
			const skip = 0;
			const limit = options.limit ? options.skip + options.limit : undefined;
			options = {
				...options,
				skip,
				limit,
			};
		}

		return Collection.find(selector, options);
	};

export default pageQuery;
