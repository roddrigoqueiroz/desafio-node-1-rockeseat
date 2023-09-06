import { randomUUID } from 'node:crypto';

export class Task {
    constructor(title, description) {
        this.id = randomUUID()
        this.title = title;
        this.description = description;
        this.completed_at = null;
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}