# Format: FROM repository[:version]
FROM nginx:alpine
COPY ctm-ui.conf /etc/nginx/conf.d/default.conf
EXPOSE 9100
ENTRYPOINT ["nginx","-g","daemon off;"]