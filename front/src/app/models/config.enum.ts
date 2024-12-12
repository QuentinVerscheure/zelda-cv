/**
 * Represents the properties of the config file
 * @param debugMode: if true, background collision, player mobility and hitboxes will be visibles,
 * @param menuName: name of the owner of the site to display in the menu
 * @param cvName: name of the cv when doc is dowload
 * @param user: mail of the owner of the site display in the contactHouse
 */
export interface AppConfig {
  debugMode: boolean;
  me: {
    menuName: string;
    cvName: string;
    mail: string;
  };
}
