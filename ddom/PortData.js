export class PortData {
  open = 0;
  req = Number.MAX_SAFE_INTEGER;
  ftp = false;
  ssh = false;
  smtp = false;
  sql = false;
  http = false;

  /**
   * @param {Number} open   Number of opened ports
   * @param {Number} req    Required number of opened ports
   * @param {Boolean} ftp   FTP port status
   * @param {Boolean} ssh   SSH port status
   * @param {Boolean} smtp  SMTP port status
   * @param {Boolean} sql   SQL port status
   * @param {Boolean} http  HTTP port status
   */
  constructor(open, req, ftp, ssh, smtp, sql, http) {
    this.open = open;
    this.req = req;
    this.ftp = ftp;
    this.ssh = ssh;
    this.smtp = smtp;
    this.sql = sql;
    this.http = http;
  }

  toString() {
    return `[PortData] Open: ${this.open}/${this.req} (FTP: ${this.ftp}, SSH: ${this.ssh}, SMTP: ${this.smtp}, SQL: ${this.sql}, HTTP: ${this.http})`;
  }
}