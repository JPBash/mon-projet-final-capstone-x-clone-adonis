import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register.show': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'auth.verify_otp.show': { paramsTuple?: []; params?: {} }
    'auth.verify_otp.store': { paramsTuple?: []; params?: {} }
    'auth.create_password.show': { paramsTuple?: []; params?: {} }
    'auth.create_password.store': { paramsTuple?: []; params?: {} }
    'auth.login.show': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'tweets.store': { paramsTuple?: []; params?: {} }
    'tweets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tweets.like': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.follow': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'verifyEmail': { paramsTuple: [ParamValue]; params: {'email': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register.show': { paramsTuple?: []; params?: {} }
    'auth.verify_otp.show': { paramsTuple?: []; params?: {} }
    'auth.create_password.show': { paramsTuple?: []; params?: {} }
    'auth.login.show': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'verifyEmail': { paramsTuple: [ParamValue]; params: {'email': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'auth.register.show': { paramsTuple?: []; params?: {} }
    'auth.verify_otp.show': { paramsTuple?: []; params?: {} }
    'auth.create_password.show': { paramsTuple?: []; params?: {} }
    'auth.login.show': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.user.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'verifyEmail': { paramsTuple: [ParamValue]; params: {'email': ParamValue} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'auth.verify_otp.store': { paramsTuple?: []; params?: {} }
    'auth.create_password.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'tweets.store': { paramsTuple?: []; params?: {} }
    'tweets.like': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.follow': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'tweets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}