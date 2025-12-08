module.exports = {
    apps: [
        {
            name: "bbdbuy-mb",
            script: "./node_modules/next/dist/bin/next",
            args: "start -p 3001",
            cwd: "/usr/frontend/bbdbuy-mb",
            instances: 1,
            watch: false,
            autorestart: true,
            max_memory_restart: "600M",
            env: {
                NODE_ENV: "production"
            },
            output: "/var/log/bbdbuy-mb/out.log",
            error: "/var/log/bbdbuy-mb/error.log"
        }
    ]
};
