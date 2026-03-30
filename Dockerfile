# ─────────────────────────────────────────────────────────────
#  Kawatra Impex — Static Site Docker Image
#  Base: nginx:alpine  (~25 MB, production-ready)
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy site files into nginx web root
COPY . /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
