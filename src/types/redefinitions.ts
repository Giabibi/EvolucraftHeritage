export {};

declare global {
    interface String {
        capitalize(): string;
    }
}

// Implémentation de la méthode `capitalize`
String.prototype.capitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
