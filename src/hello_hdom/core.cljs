(ns ^:figwheel-hooks hello-hdom.core
  (:require
   [goog.dom :as gdom]
   [hdom :as hdom]))

(defn multiply [a b] (* a b))

;; define your app data so that it doesn't get over-written on reload
(defonce app-state (atom {:text "Hello world!"}))

(defn hello []
  (clj->js [:h1.main "heading"]))

(defn app [ctx  pps]
  (clj->js [:div#start.thing hello "some text"]))

(defn get-app-element []
  (gdom/getElement "app"))

(hdom/start (app nil {:foo :bar}))

;; specify reload hook with ^;after-load metadata
(defn ^:after-load on-reload [])
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)

