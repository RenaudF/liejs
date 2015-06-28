module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %> ' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
			'<%= pkg.author %>\n * Licensed <%= pkg.license %> */\n',
		// Task configuration.
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['src/**/*.js'],
				dest: 'lie.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'lie.min.js'
			}
		},
		karma: {
			options: {
				configFile: 'karma.conf.js'
			},
			unit: {
				singleRun: true
			},
			manual: {
				options: {
					configFile: 'karma.manual.conf.js'
				},
				logLevel: 'DEBUG'
			}
		},
		watch: {
			src: {
				files: ['src/**/*.js'],
				tasks: ['karma:unit', 'connect:test']
			},
			test: {
				files: ['test/**/*.js'],
				tasks: ['karma:unit']
			}
		},
		connect: {
			development: {
				options: {
					base: '.',
					port: '<%= connect.production.options.port %>',
					keepalive: true
				}
			},
			production: {
				options: {
					base: '.',
					keepalive: true,
					port: 8001,
					middleware: function (connect, options) {
						return [
							// duh.. do I need that?
							function (req, res, next) {
								if (req.url === '/lie.js') {
									req.url = '/lie.min.js';
								}
								next();
							},
							connect.static(options.base),
						];
					}
				}
			},
			coverage: {
				options:{
					base: 'coverage/',
					port: 8002,
					keepalive: true
				}
			}
		},
		open: {
			preview: {
				path: 'http://localhost:<%= connect.production.options.port %>'
			},
			coverage:{
				path: 'http://localhost:<%= connect.coverage.options.port %>'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-karma');

	// Default task.
	grunt.registerTask('default', ['karma:unit', 'concat', 'uglify']);
	grunt.registerTask('preview', ['open:preview', 'connect:development']);
	grunt.registerTask('preview-live', ['default', 'open:preview', 'connect:production']);
	grunt.registerTask('test', ['karma:manual']);
	grunt.registerTask('coverage', ['open:coverage', 'connect:coverage']);
};
