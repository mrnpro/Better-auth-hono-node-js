.PHONY: all clean install generate dev

all: 
		clean install generate dev

clean:
		rm -rf node_modules

install:
		pnpm install

generate:
    		npx prisma generate

dev:
	 pnpm run dev