run: 
	npx ts-node src/main/boot.ts 
watch:
	nodemon --watch 'src/**/*.ts' --ignore 'src/**/*.spec.ts' --exec 'ts-node' src/main/boot.ts