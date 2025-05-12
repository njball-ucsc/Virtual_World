class Camera {
    constructor () {
        this.fov = 60;
        this.eye = new Vector3([0, 15, -30]);
        this.at = new Vector3([0, 0, 0]);
        this.up = new Vector3([0, 1, 0]);
        this.front = new Vector3([0, 0, 1]);
        this.right = new Vector3([-1, 0, 0]);
        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        // Mouse rotation
        this.yaw = 0;
        this.pitch = 0;
        this.updateInitialCameraVectors();
        this.updateViewMatrix();
    }

    updateViewMatrix() {
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    updateProjectionMatrix(aspect) {
        this.projectionMatrix.setPerspective(
            this.fov, aspect, 0.1, 1000
        );
    }

    moveForward(speed = 0.06) {
        let f = new Vector3(this.at.elements);
        f.sub(this.eye);
        f.normalize();
        f.mul(speed);
        this.eye.add(f);
        this.at.add(f);
        this.updateViewMatrix();
    }

    moveBackward(speed = 0.06) {
        let b = new Vector3(this.eye.elements);
        b.sub(this.at);
        b.normalize();
        b.mul(speed);
        this.eye.add(b);
        this.at.add(b);
        this.updateViewMatrix();
    }

    moveLeft(speed = 0.06) {
        let f = new Vector3(this.at.elements);
        f.sub(this.eye);
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(speed);
        this.eye.add(s);
        this.at.add(s);
        this.updateViewMatrix();
    }

    moveRight(speed = 0.06) {
        let f = new Vector3(this.at.elements);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(speed);
        this.eye.add(s);
        this.at.add(s);
        this.updateViewMatrix();
    }

    panLeft(angle = 0.02) {
        this.yaw -= angle;
        this.updateCameraVectors();
    }

    panRight(angle = 0.02) {
        this.yaw += angle;
        this.updateCameraVectors();
    }

    panHorizontal(angle) {
        this.yaw += angle;
        this.updateCameraVectors();
    }

    panVertical(angle) {
        this.pitch = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, this.pitch + angle));
        this.updateCameraVectors();
    }

    updateInitialCameraVectors() {
        const direction = new Vector3(this.at.elements).sub(this.eye).normalize();

        this.pitch = Math.asin(direction.elements[1]);
        this.yaw = Math.atan2(direction.elements[0], direction.elements[2]);

        this.yaw += Math.PI;
        if (this.yaw > Math.PI) {
            this.yaw -= 2 * Math.PI;
        } else if (this.yaw < -Math.PI) {
            this.yaw += 2 * Math.PI;
        }

        this.front.elements[0] = Math.sin(this.yaw) * Math.cos(this.pitch);
        this.front.elements[1] = Math.sin(this.pitch);
        this.front.elements[2] = -Math.cos(this.yaw) * Math.cos(this.pitch);
        this.front.normalize();

        this.right = Vector3.cross(this.front, this.up).normalize();
        this.up = Vector3.cross(this.right, this.front).normalize();
    }

    updateCameraVectors() {
        // Calculate new vectors and find rotation
        this.front.elements[0] = Math.sin(this.yaw) * Math.cos(this.pitch);
        this.front.elements[1] = Math.sin(this.pitch);
        this.front.elements[2] = -Math.cos(this.yaw) * Math.cos(this.pitch);
        this.front.normalize();

        this.right.elements[0] = Math.cos(this.yaw);
        this.right.elements[1] = 0;
        this.right.elements[2] = Math.sin(this.yaw);
        this.right.normalize();

        this.up = Vector3.cross(this.right, this.front).normalize();

        this.at = new Vector3(this.eye.elements);
        this.at.add(this.front);

        this.updateViewMatrix();
    }

    getPosition() {
        return [this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]];
    }

    getForwardVector() {
        return this.front;
    }

    getGroundIntersection() {
        const rayOrigin = this.eye;
        const rayDirection = this.front;

        const groundY = 0;
        const planeNormal = new Vector3([0, 1, 0]);

        const denom = Vector3.dot(rayDirection, planeNormal);
        if (Math.abs(denom) < 0.0001) {
            return null; // ray is parallel to floor
        }

        const planePoint = new Vector3([0, groundY, 0]);
        const diff = rayOrigin.sub(planePoint);
        const t = -Vector3.dot(diff, planeNormal) / denom;

        if (t < 0) return null; // intersection behind camera

        const intersection = new Vector3(rayDirection.elements);
        intersection.mul(t);
        intersection.add(rayOrigin);

        return [intersection.elements[0], intersection.elements[2]];
    }
}