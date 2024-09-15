"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";

class Status {
  static Work = new Status(1, "Work", 20 * 60);
  static ShortBreak = new Status(2, "Short Break", 20);
  static LongBreak = new Status(3, "Long Break", 5 * 60);

  public next?: Status;
  static {
    Status.Work.next = Status.ShortBreak;
    Status.ShortBreak.next = Status.LongBreak;
    Status.LongBreak.next = Status.Work;
  }
  private constructor(
    public readonly value: number,
    public readonly description: string,
    public readonly duration: number
  ) {}
}

export default function Home() {
  const [status, setStatus] = useState(Status.Work);
  const [time, setTime] = useState(20 * 60);
  const [isMounted, setIsMounted] = useState(false);
  const alarm = useRef(new Audio("music/alarmSound.wav")); // Use useRef to create the alarm object only once
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(true); // State to track if the timer is running
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isRunning && time > 0) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else if (time === 0) {
      alarm.current.play();
      setIsAlarmPlaying(true);
      setIsRunning(false);
    }
  }, [isRunning, time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  const toggleAlarm = () => {
    if (isAlarmPlaying) {
      alarm.current.pause();
    } else {
      alarm.current.play();
    }
    setIsAlarmPlaying(!isAlarmPlaying);
  };
  const toggleIsRunning = () => {
    setIsRunning(!isRunning);
  };
  const switchToNextStatus = () => {
    if (status.next != null) {
      setStatus(status.next);
      setTime(status.next.duration);
    } else {
      console.log("status.next is null");
    }
    toggleAlarm();
  };
  return (
    <div>
      <div className="flex flex-col items-center mt-52">
        <h1>Countdown Timer:</h1>
        <h1>
          {status === Status.Work
            ? "Work"
            : status === Status.ShortBreak
            ? "Short Break"
            : "Long Break"}
        </h1>
        {isMounted && <p className="text-4xl">{formatTime(time)}</p>}
        {time != 0 && (
          <Button onClick={toggleIsRunning}>
            {isRunning == true ? "Pause" : "Start"}
          </Button>
        )}
        {time === 0 && <button onClick={switchToNextStatus}>finish</button>}
      </div>
    </div>
  );
}
