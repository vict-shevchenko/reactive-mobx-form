const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: "/assets/",
	},

	resolve: {
		modules: ["node_modules", path.resolve(__dirname, "app")],
		extensions: [".js", ".ts", ".json", ".jsx", ".tsx", ".css", ".scss"]
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: [
					path.resolve(__dirname, "src")
				],
				loader: 'ts-loader',
			}
		]
	}
}