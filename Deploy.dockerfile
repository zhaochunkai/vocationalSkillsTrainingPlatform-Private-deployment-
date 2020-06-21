FROM node as build-image

RUN yarn config set registry 'https://registry.npm.taobao.org'

WORKDIR /app
COPY package.json ./package.json

# 配置国内的镜像源。
RUN npm config rm proxy && npm config rm https-proxy & \
    yarn config delete proxy & \
    yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass & \
    yarn config set registry https://registry.npm.taobao.org
    
# 构建镜像。
RUN yarn && yarn add mux.js

COPY ./ ./

RUN yarn run build

FROM nginx
COPY --from=build-image /app/dist /usr/share/nginx/html
COPY --from=build-image /app/default.conf /etc/nginx/conf.d
