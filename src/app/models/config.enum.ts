/**
 * Represents the properties of the config file
 */
export interface AppConfig {
  debugMode: boolean;
  me: {
    menuName: string;
    cvName: string;
    mail: string;
  };
}
