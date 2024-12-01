export default class VersionChecker {
    private readonly localPackageVersion: string;
    private readonly versionUrl: string = "https://raw.githubusercontent.com/cloudmaker97/FS25-Discord-Bot/refs/heads/main/package.json";

    constructor() {
        this.localPackageVersion = require('../../package.json').version;
    }

    /**
     * Check if the version of the bot is up to date
     */
    public async checkVersionIsUpdated(): Promise<boolean> {
        const latestVersion = await this.getLatestReleasedVersion();
        return this.isNewerVersion(latestVersion, this.localPackageVersion);
    }

    /**
     * Get the latest released version of the bot from the github repository
     */
    public async getLatestReleasedVersion(): Promise<string> {
        const response = await fetch(this.versionUrl);
        const latestPackage = await response.text();
        const latestVersion = JSON.parse(latestPackage)?.version;
        return latestVersion;
    }

    /**
     * Check if the latest version is newer than the current version
     */
    public isNewerVersion(latestVersion: string, currentVersion: string) {
        const v1Parts: number[] = latestVersion.split('.').map(Number);
        const v2Parts: number[] = currentVersion.split('.').map(Number);
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const part1 = v1Parts[i] || 0;
            const part2 = v2Parts[i] || 0;
            if (part1 > part2) return false;
            if (part1 < part2) return true;
        }
        return true;
    }
}