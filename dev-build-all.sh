#!/bin/bash

modulesFolder="local/"
modulePrefix="if-"
moduleFrontend="frontend/"
adminFolder="admin/"

backendCompile="tsc"
frontendBuild="npm run build"
installPackages="npm install"
pullChanges="git pull"

for dir in */; do
    echo "Processing directory: $dir"

    if [ "$dir" == "$adminFolder/" ]; then
        echo "Building admin frontend..."
        (cd "$dir" && $installPackages && $frontendBuild)
        continue
    fi

    if [ "$dir" == "$modulesFolder" ]; then
        for module in "$dir"*/; do
            echo "Processing module: $module"
            if [ -d "$module$moduleFrontend" ]; then
                echo "Building frontend for module: $module"
                (cd "$module$moduleFrontend" && $installPackages && $frontendBuild)
            fi
            if [ -d "$module" ]; then
                echo "Compiling backend for module: $module"
                (cd "$module" && $pullChanges && $installPackages && $backendCompile)
            fi
        done
    fi
done