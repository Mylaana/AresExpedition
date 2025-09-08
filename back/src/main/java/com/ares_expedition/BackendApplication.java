package com.ares_expedition;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println(">>> Launching spring application <<<");
		SpringApplication.run(BackendApplication.class, args);
		System.out.println(">>> Spring application running <<<");
	}

}
