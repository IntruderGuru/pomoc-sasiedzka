import { UUID } from 'crypto';

/**
 * Domain model representing an announcement (post/ad).
 * Encapsulates the internal state of an announcement and provides accessors for controlled read access.
 *
 * This class serves as a plain domain object (not tied to persistence logic),
 * and is typically instantiated in the repository and returned to service/controller layers.
 */
export class Announcement {
    constructor(
        /** Unique identifier of the announcement (UUID v4) */
        readonly id: UUID,

        /** UUID of the user who created the announcement */
        readonly userId: UUID,

        /** Title of the announcement (e.g., "Bike for sale") */
        private title: string,

        /** Main content/body of the announcement */
        private content: string,

        /** Category label (e.g., "electronics", "services", "misc") */
        private category: string,

        /** Type label (e.g., "offer", "request") */
        private type: string,

        /** Creation timestamp (set when announcement is created) */
        readonly createdAt: Date
    ) {}

    // Accessor methods to expose private fields in a controlled manner

    getTitle(): string {
        return this.title;
    }

    getContent(): string {
        return this.content;
    }

    getCategory(): string {
        return this.category;
    }

    getType(): string {
        return this.type;
    }
}
